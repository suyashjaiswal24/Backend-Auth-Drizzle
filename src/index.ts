import { createServer } from "node:http";
import {createExpressApp} from './app/index'

async function main() {
    try {
        const server = createServer(createExpressApp());
        const PORT: number = 8080;

        server.listen(PORT, () => {
            console.log(`Http Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log("Error starting http server")
        throw error;
    }
}

main();