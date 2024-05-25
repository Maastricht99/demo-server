import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Bid } from './bid.entity';
import { Product } from 'src/product/product.entity';

@Injectable()
export class AuctionService {

    constructor(
        private readonly manager: EntityManager
    ) {}

    async bidOnProduct(
        userId: string,
        productId: string,
        amount: number
    ) {
        // Business logic not implemented
        // Transactions not implemented

        const bid = new Bid(productId, userId, amount);
        await this.manager.save(Bid, bid);

        const product = await this.manager.findOneBy(Product, { id: productId });
        product.currentPrice = bid.amount;
        await this.manager.save(Product, product);

        return bid.id;

        // Emit socket event, newBid
    }

    async getBidById(bidId: string) {
        const query = `
            SELECT 
                b.id,
                p.id AS "productId",
                u.id AS "userId",
                u.first_name AS "userFirstName",
                u.last_name AS "userLastName",
                b.amount,
                b.created_at AS "createdAt"
            FROM products AS p
            LEFT JOIN bids AS b
            ON p.id = b.product_id
            LEFT JOIN users AS u
            ON b.user_id = u.id
            WHERE b.id = $1
        `

        const res = await this.manager.query(query, [bidId]);

        const bid = res.length > 0 ? res[0] : null;

        return bid;
    }

    async getProductBids(productId: string) {
        const query = `
            SELECT 
                p.id AS "productId",
                u.id AS "userId",
                u.first_name AS "userFirstName",
                u.last_name AS "userLastName",
                b.amount,
                b.created_at AS "createdAt"
            FROM products AS p
            LEFT JOIN bids AS b
            ON p.id = b.product_id
            LEFT JOIN users AS u
            ON b.user_id = u.id
            WHERE p.id = $1
            ORDER BY b.created_at DESC
        `

        const bids = await this.manager.query(query, [productId]);

        return bids;
    }

    async getAuctionedProducts() {
        const productsQuery = `
            SELECT
                p.id,
                p.name,
                p.description,
                p.current_price AS "currentPrice"
            FROM products AS p
            WHERE p.status = 'AUCTIONED'
        `;

        const products = await this.manager.query(productsQuery, []);


        /**
         * Didn't want to write complex query and aggregate everything all at once,
         * not ideal for performance
         */
        const productsWithLastBid = await Promise.all(products.map(async (prod: any) => {
            const lastBidQuery = `
                SELECT 
                    b.id,
                    b.created_at AS "createdAt",
                    b.amount,
                    u.id AS "userId",
                    u.first_name AS "userFirstName",
                    u.last_name AS "userLastName"
                FROM bids AS b
                LEFT JOIN users AS u
                ON b.user_id = u.id
                WHERE b.product_id = $1
                ORDER BY b.created_at DESC
                LIMIT 1
            `;

            let res = await this.manager.query(lastBidQuery, [prod.id]);

            return {
                ...prod,
                lastBid: res.length > 0 ? res[0] : null
            }

        }));

        return productsWithLastBid;

    }

    async getAuctionedProductById(productId: string) {
        const productsQuery = `
            SELECT
                p.id,
                p.name,
                p.description,
                p.current_price AS "currentPrice"
            FROM products AS p
            WHERE p.id = $1
        `;

        const res = await this.manager.query(productsQuery, [productId]);

        const product = res.length > 0 ? res[0] : null; 

        const lastBidQuery = `
            SELECT 
                b.id,
                b.created_at AS "createdAt",
                b.amount,
                u.id AS "userId",
                u.first_name AS "userFirstName",
                u.last_name AS "userLastName"
            FROM bids AS b
            LEFT JOIN users AS u
            ON b.user_id = u.id
            WHERE b.product_id = $1
            ORDER BY b.created_at DESC
            LIMIT 1
        `;

        const res2 = await this.manager.query(lastBidQuery, [productId]);

        const lastBid = res2.length > 0 ? res2[0] : null;

        return {
            ...product,
            lastBid
        }

    }
}

/**
 * WEBSOCKET AUCTION MAIN
 * - when user connect, get all products
 * - when product is added, get product and push to array
 * - when bid is added, update array
 */

/**
 * WEBSOCKET AUCTION PRODUCT
 * - when user connect, get all bids
 * - when bid is added, update array
 */