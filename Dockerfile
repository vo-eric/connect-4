FROM oven/bun:1

# Set working directory
# mkdir app && cd app
WORKDIR /app

# copy package.json & bun.lockb from the GITHUB SOURCE to the current working directory
# COPY package.json bun.lockb ./
COPY . .

RUN bun install --frozen-lockfile

EXPOSE 3000

# Start the server
CMD ["bun", "run", "server.ts"]