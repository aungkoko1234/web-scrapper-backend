import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('keywords')
export class KeyWord {
  @PrimaryColumn()
  id: string;

  @Column({
    name: 'name',
  })
  name: string;

  @Column({
    name: 'created_by',
  })
  createdBy: string;

  @Column({
    name: 'adsword_count',
    default: 0,
  })
  adsWordCount: number;

  @Column({
    name: 'link_count',
    default: 0,
  })
  linkCount: number;

  @Column({
    name: 'search_result_count',
    default: 0,
  })
  searchResultCount: number;

  @Column({
    name: 'html_source',
    type: 'text',
    default: '',
  })
  htmlSource: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
