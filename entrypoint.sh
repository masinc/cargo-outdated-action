#!/bin/sh -l
PATH=$PATH:/usr/local/cargo/bin/
cargo outdated --exit-code 1 
