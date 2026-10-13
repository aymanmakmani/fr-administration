export class Association {
  constructor(
    public id: number,
    public name: string,
    public idUsers: number[] = [],
  ) {}
}
