import { jsonToPayload, ExpirationTime } from "@arkiv-network/sdk/utils";
import ArkivClient from '../config/arkivClientSingleton';

class ArkivEntityFactory {
  public static async createEntity(data: any, type: string, priority: number, expiresIn: number): Promise<any> {
    const arkivClient = ArkivClient.getInstance();

    const { entityKey, txHash } = await arkivClient.walletClient.createEntity({
      payload: jsonToPayload(data),
      contentType: 'application/json',
      attributes: [
        { key: 'type', value: type },
        { key: 'priority', value: priority }
      ],
      expiresIn: ExpirationTime.fromMinutes(expiresIn),
    });

    return { entityKey, txHash };
  }
}

export default ArkivEntityFactory;
