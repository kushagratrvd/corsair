import { OpenAIAgentsProvider } from '@corsair-dev/mcp';
import { Agent, run, tool } from '@openai/agents';
import { corsair } from '../server/corsair';

const provider = new OpenAIAgentsProvider();
const tools = provider.build({ corsair, tool });

const agent = new Agent({
    name: 'gmail-agent',
    model: 'gemini-3.5-flash',
    instructions:
        'You have access to Gmail tools. Use list_operations to discover available APIs, get_schema to understand required arguments, and run_script to execute them. Use the corsair.withTenant() function to specify the tenant ID (user_abc123).',
    tools,
});

const result = await run(agent, 'list all the mails');
console.log(result.finalOutput);