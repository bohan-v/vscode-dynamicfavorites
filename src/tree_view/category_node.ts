export class CategoryNode {
  constructor(
    public readonly label: string,
    public readonly filePath: string | undefined,
    public readonly children: CategoryNode[],
    public readonly icon: string | undefined = undefined
  ) {}
}
