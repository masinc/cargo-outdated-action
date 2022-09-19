FROM rust:slim-buster

RUN cargo install --locked cargo-outdated

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
