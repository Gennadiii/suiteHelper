let counter = 0;

export const userHelper = {
  async createUser(): Promise<userInterface> {
    return {
      name: `user${++counter}`,
      password: 'password',
      async erase() {
        console.log(`Deleting user: ${this.name}`);
      },
    };
  },
};


export interface userInterface {
  name: string;
  password: string;
  erase: () => Promise<void>;
}
