import { Client, PrivateKey } from "@hiero-ledger/sdk";
import { HederaAIToolkit } from "@hashgraph/hedera-agent-kit-ai-sdk";
import { AgentMode } from "@hashgraph/hedera-agent-kit";
import {
  coreAccountPlugin,
  coreAccountQueryPlugin,
} from "@hashgraph/hedera-agent-kit/plugins";
import type { ToolSet } from "ai";

export function getHederaTools(): ToolSet {
  const accountId = process.env.HEDERA_ACCOUNT_ID;
  const privateKey = process.env.HEDERA_PRIVATE_KEY;
  const network = process.env.HEDERA_NETWORK ?? "testnet";

  if (!accountId || !privateKey) {
    throw new Error(
      "HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY must be set in .env to use Hedera tools",
    );
  }

  const client =
    network === "mainnet" ? Client.forMainnet() : Client.forTestnet();
  client.setOperator(accountId, PrivateKey.fromStringDer(privateKey));

  const toolkit = new HederaAIToolkit({
    client,
    configuration: {
      plugins: [coreAccountPlugin, coreAccountQueryPlugin],
      context: {
        mode: AgentMode.AUTONOMOUS,
      },
    },
  });

  return toolkit.getTools() as unknown as ToolSet;
}
