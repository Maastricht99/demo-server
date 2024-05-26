import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AuctionService } from './auction.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
@Injectable()
export class AuctionGateaway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly auctionService: AuctionService) {}

  afterInit(server: Server) {
    console.log('Init socket');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('requestInitialAuctionedProducts')
  async handleRequestInitialAuctionedProducts(client: Socket) {
    const products = await this.auctionService.getAuctionedProducts();
    client.emit('sendInitialAuctionedProducts', products);
  }

  @SubscribeMessage('requestInitialProductBids')
  async handleRequestInitialProductBids(
    client: Socket,
    payload: { productId: string },
  ) {
    const bids = await this.auctionService.getProductBids(payload.productId);
    client.emit('sendInitialProductBids', bids);
  }

  @SubscribeMessage('addNewBid')
  async handleAddNewBid(
    _: Socket,
    payload: { userId: string; productId: string; amount: number },
  ) {
    const bidId = await this.auctionService.bidOnProduct(
      payload.userId,
      payload.productId,
      payload.amount,
    );
    const bid = await this.auctionService.getBidById(bidId);
    this.server.emit('newBidAdded', bid);
  }

  async handleNewProductAdded(productId: string) {
    const product =
      await this.auctionService.getAuctionedProductById(productId);
    this.server.emit('newProductAdded', product);
  }
}
