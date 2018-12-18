export const time = {
  async sleep(timeout, reason?) {
    console.log(`Sleeping "${timeout / 1000}" seconds (${reason})`);
    await new Promise(resolve => setTimeout(resolve, timeout));
  }
};
