const snowflake = (snowflake: number | string | bigint) =>
  new Date(Number((BigInt(snowflake) >> BigInt(22)) + BigInt(1420070400000)));

export default snowflake;
