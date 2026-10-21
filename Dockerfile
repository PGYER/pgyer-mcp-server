FROM node:24-slim

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY bin ./bin

# Pass the API key at run time: docker run -i --rm -e PGYER_API_KEY=... <image>
ENTRYPOINT ["node", "bin/pgyer-mcp-server.js"]
