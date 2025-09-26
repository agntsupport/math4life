FROM redis:7-alpine

# Copy custom redis configuration
COPY redis.conf /usr/local/etc/redis/redis.conf

# Install additional tools
RUN apk add --no-cache curl

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD redis-cli ping || exit 1

# Performance and security settings
RUN echo "maxmemory 256mb" >> /usr/local/etc/redis/redis.conf && \
    echo "maxmemory-policy allkeys-lru" >> /usr/local/etc/redis/redis.conf && \
    echo "save 900 1" >> /usr/local/etc/redis/redis.conf && \
    echo "save 300 10" >> /usr/local/etc/redis/redis.conf && \
    echo "save 60 10000" >> /usr/local/etc/redis/redis.conf && \
    echo "appendonly yes" >> /usr/local/etc/redis/redis.conf

EXPOSE 6379

CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]