import { Injectable } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { AuctionService } from "./auction.service";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: { origin: "*" }
})
@Injectable()
export class AuctionGateaway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;

    constructor(
        private readonly auctionService: AuctionService
    ) {}

    afterInit(server: Server) {
        console.log("Init socket");
    }
    
    handleConnection(client: Socket) {
        console.log("Client connected:", client.id);
    }

    handleDisconnect(client: Socket) {
        console.log("Client disconnected:", client.id);
    }

    /**
     * RECEIVE: nothing
     * SEND: products [{ productId, productName, productCurrentPrice, lastBid: { amount, createdAt, userId, userFirstName, userLastName } }]
     */
    @SubscribeMessage("requestInitialAuctionedProducts")
    async handleRequestInitialAuctionedProducts(client: Socket) {
      const products = await this.auctionService.getAuctionedProducts();
      client.emit("sendInitialAuctionedProducts", products);
    }


    /**
     * RECEIVE: productId
     * SEND: bids [{ productId, bidderId, bidderFirstName, bidderLastName, bidAmount, bidCreatedAt }]
     */
    @SubscribeMessage("requestInitialProductBids")
    async handleRequestInitialProductBids(client: Socket, payload: { productId: string }) {
      const bids = await this.auctionService.getProductBids(payload.productId);
      client.emit("sendInitialProduct", bids);
    }


    /**
     * RECEIVE: 
     * SEND lastBid { productId, amount, createdAt, userId, userFirstName, userLastName }
     */
    @SubscribeMessage("addNewBid")
    async handleAddNewBid(client: Socket, payload: { userId: string, productId: string, amount: number }) {
      const bidId = await this.auctionService.bidOnProduct(payload.userId, payload.productId, payload.amount);
      const bid = await this.auctionService.getBidById(bidId);
      this.server.emit("newBidAdded", bid);
    }

    /**
     * RECEIVE: nothing
     * SEND: product { productId, productName, productCurrentPrice, lastBid: { amount, createdAt, userId, userFirstName, userLastName } }
     */
    async handleNewProductAdded(productId: string) {
        const product = await this.auctionService.getAuctionedProductById(productId)
        this.server.emit("newProductAdded", product);
    }
}
