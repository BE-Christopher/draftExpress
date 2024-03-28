import * as http from 'http';
import * as socket from 'socket.io';
import * as socketConnect from 'socket.io-client';
import config from '../../config';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

class RealTimeServer {
    private port: number;
    private server: http.Server;
    private io: socket.Server;

    constructor() {
        this.port = config.socketPort;
    }

    init() {
        this.server = http.createServer();
        this.io = new socket.Server(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        // realtime listen
        this.io.on('connection', (socketElement: socket.Socket) => {
            console.log('>>>>>>>>>>Connected<<<<<<<<<<<');

            // real-time actions
            socketElement.on(
                'joinChanel',
                (chanel: string) => {
                    console.log('>>>>>>>>>>Join Chanel<<<<<<<<<<<');
                    socketElement.join(chanel);
                }
            );

            socketElement.on(
                'leaveChanel',
                (chanel: string) => {
                    console.log('>>>>>>>>>>Leave Chanel<<<<<<<<<<<');
                    socketElement.leave(chanel);
                }
            );

            socketElement.on(
                'sendData',
                (
                    payload: { chanel: string, data: any; },

                ) => {
                    console.log('>>>>>>>>>>Send data<<<<<<<<<<<');
                    const { chanel, data } = payload;
                    this.io.to(chanel).emit('sendData', data);
                }
            );

            socketElement.on('disconnect', () => {
                console.log('>>>>>>>>>>Disconnect<<<<<<<<<<<');
            });
        });

        // run new real-time server
        this.server.listen(this.port, () => {
            console.log(`Socket server listening on port ${this.port}`);
        });
    }
}

class RealTimeService {
    private connectedSocket: socketConnect.Socket<DefaultEventsMap, DefaultEventsMap> | null;

    constructor() {
        this.connectedSocket = null;
    }

    // client actions
    async connectToRealTime() {
        this.connectedSocket = await socketConnect.io('http://localhost:3030');
    }
    async disconnectToRealTime() {
        await this?.connectedSocket?.disconnect();
    }

    async joinChanel(chanel: string) {
        await this?.connectedSocket?.emit('joinChanel', chanel);
    }

    async leaveChanel(chanel: string) {
        await this?.connectedSocket?.emit('leaveChanel', chanel);
    }

    async sendData(payload: { chanel: string, data: any; }) {
        await this.connectToRealTime();
        await this?.connectedSocket?.emit('sendData', payload);
        await this.leaveChanel(payload.chanel);
    }
}

export const realTimeServer = new RealTimeServer();

export const realTimeService = new RealTimeService();
