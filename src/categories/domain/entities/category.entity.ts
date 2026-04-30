export interface CategoryProps {
  id?: string;
  name: string;
  emoji?: string;
}

export class Category {
  public readonly id?: string;
  public readonly name: string;
  public readonly emoji?: string;

  constructor(props: CategoryProps) {
    this.id = props.id;
    this.name = props.name;
    this.emoji = props.emoji;
  }

  static fromPrisma(data: CategoryProps): Category {
    return new Category({
      id: data.id,
      name: data.name,
      emoji: data.emoji,
    });
  }
}
