import {SubstrateEvent} from "@subql/types";
import {Account,Transfer} from "../types";
import {Balance} from "@polkadot/types/interfaces";

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    const toAddress = event.event.data[1]; // numeration starts from 0!
    const amount = event.event.data[2];
    logger.warn("\nDATA:" + event.event.toString());

    const toAccount = await Account.get(toAddress.toString());
    if (!toAccount) {
        // what if created by another container?
        await new Account(toAddress.toString()).save();
        logger.warn("\nCreated acc");
    }

    const transfer = new Transfer(`${event.block.block.header.number.toNumber()}-${event.idx}`,);
    transfer.blockNumber = event.block.block.header.number.toBigInt();
    transfer.toId = toAddress.toString();
    transfer.amount = (amount as Balance).toBigInt();
    await transfer.save();
}
