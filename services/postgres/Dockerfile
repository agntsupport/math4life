FROM postgres:15-alpine

# Install additional extensions if needed
RUN apk add --no-cache postgresql-contrib

# Set locale
ENV LANG en_US.utf8

# Copy initialization scripts
COPY ../../backend/src/database/init.sql /docker-entrypoint-initdb.d/

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1

# Performance tuning for small instances
RUN echo "shared_preload_libraries = 'pg_stat_statements'" >> /usr/local/share/postgresql/postgresql.conf.sample && \
    echo "log_statement = 'all'" >> /usr/local/share/postgresql/postgresql.conf.sample && \
    echo "log_duration = on" >> /usr/local/share/postgresql/postgresql.conf.sample && \
    echo "max_connections = 200" >> /usr/local/share/postgresql/postgresql.conf.sample && \
    echo "shared_buffers = 256MB" >> /usr/local/share/postgresql/postgresql.conf.sample

EXPOSE 5432