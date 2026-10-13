export class Association {
  constructor(
    public id: number,
    public name: string,
    public userIds: number[] = [], 
  ) {}
}