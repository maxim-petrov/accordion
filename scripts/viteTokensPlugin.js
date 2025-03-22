import { generateTokenFiles } from './generateTokens.js';
import path from 'path';

export default function tokensPlugin() {
  return {
    name: 'vite-plugin-tokens',
    
    buildStart() {
      console.log('🔄 Generating tokens files on build start...');
      generateTokenFiles();
    },
    
    configureServer(server) {
      const watcher = server.watcher;
      
      watcher.add([
        path.resolve('src/component/tokens/tokens.json'),
        path.resolve('src/tokens.json')
      ]);
      
      watcher.on('change', async (filePath) => {
        if (filePath.includes('tokens.json')) {
          console.log(`🔄 Token file changed: ${filePath}`);
          const success = await generateTokenFiles();
          
          if (success) {
            server.ws.send({
              type: 'full-reload',
              path: '*'
            });
          }
        }
      });
    }
  };
} 
