"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CommunitiesGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunitiesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const communities_service_1 = require("./communities.service");
let CommunitiesGateway = CommunitiesGateway_1 = class CommunitiesGateway {
    constructor(communities) {
        this.communities = communities;
        this.logger = new common_1.Logger(CommunitiesGateway_1.name);
    }
    handleConnection(client) { this.logger.log(`Communities WS: ${client.id}`); }
    handleDisconnect(client) { this.logger.log(`Communities WS disconnect: ${client.id}`); }
    handleJoin(groupId, client) {
        client.join(`group:${groupId}`);
    }
    async handleMessage(payload, client) {
        try {
            const message = await this.communities.sendMessage(payload.userId, payload.groupId, payload.text);
            this.server.to(`group:${payload.groupId}`).emit('communityMessage', message);
        }
        catch (err) {
            client.emit('error', { message: err.message });
        }
    }
    broadcastMessage(groupId, message) {
        this.server.to(`group:${groupId}`).emit('communityMessage', message);
    }
};
exports.CommunitiesGateway = CommunitiesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CommunitiesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinGroup'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], CommunitiesGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendCommunityMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], CommunitiesGateway.prototype, "handleMessage", null);
exports.CommunitiesGateway = CommunitiesGateway = CommunitiesGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'communities', cors: { origin: '*', credentials: true } }),
    __metadata("design:paramtypes", [communities_service_1.CommunitiesService])
], CommunitiesGateway);
//# sourceMappingURL=communities.gateway.js.map