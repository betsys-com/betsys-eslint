import { TSESTree } from '@typescript-eslint/utils';
import type { ASTWithSource, TmplAstBoundText, Interpolation } from '@angular/compiler';

export type BoundText = TmplAstBoundText & {
  value: ASTWithSource & {
    ast: Interpolation & { type: string };
  };
  loc: TSESTree.SourceLocation;
};

export interface InterpolationNode {
  value: string;
  offset: number;
  location: TSESTree.SourceLocation;
}

export type IncompleteInterpolationNode = Omit<InterpolationNode, 'location'> & { location: Partial<InterpolationNode['location']> };
