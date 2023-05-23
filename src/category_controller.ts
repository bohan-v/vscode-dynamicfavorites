import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import { CategoriesProvider } from './tree_view/categories';
import { CategoryNode } from './tree_view/category_node';
import { CategoryRule } from './settings/category_rule';

export class CategoryController {
	categoriesProvider: CategoriesProvider | undefined;
	constructor(public readonly rules: CategoryRule[], public readonly rootDirPatterns: string[]) {
	}

	updatePath(path: string | undefined) {
		let provider = this.getCategoriesProvider(path);
		provider.update(this.nodes(path));
	}

	getCategoriesProvider(path: string | undefined): CategoriesProvider {
		if (this.categoriesProvider) {
			this.categoriesProvider.update(this.nodes(path));
			return this.categoriesProvider;
		}

		let provider = new CategoriesProvider(this.nodes(path));
		this.categoriesProvider = provider;
		return this.categoriesProvider;
	}

	nodes(path: string | undefined): CategoryNode[] {
		if (path === undefined) { return []; }
		let nodes: CategoryNode[] = [];
		let rootDir = this.findRootDir(path);
		if (rootDir) {
			let rootDirNoneNull = rootDir;
			nodes = this.rules.map((categoryRule) => {
				return this.createCategoryNode(rootDirNoneNull, categoryRule);
			});
		}
		return nodes;
	}

	createCategoryNode(rootDir: string, categoryRule: CategoryRule): CategoryNode {
		let files = this.findAllFiles(rootDir, categoryRule.pattern);
		let nodes: CategoryNode[] = files.map((filePath) => {
			return new CategoryNode(path.basename(filePath), filePath, []);
		});

		return new CategoryNode(categoryRule.sectionLabel, undefined, nodes, categoryRule.iconName);
	}

	findRootDir(directory: string): string | undefined {
		if (this.rootDirPatterns.length === 0) {
			throw new Error(`rootDirPatterns not found`);
		}

		if (!fs.existsSync(directory)) {
			throw new Error(`Directory not found: ${directory}`);
		}

		let notFindPattern: boolean = false;
		for (const pattern of this.rootDirPatterns) {
			let files = glob.sync(path.join(directory, pattern));
			if (files.length === 0) {
				notFindPattern = true;
				break;
			}
		}

		if (!notFindPattern) {
			return directory;
		}

		const parentDirectory = path.dirname(directory);
		if (directory === parentDirectory) {
			return undefined;
		}

		return this.findRootDir(parentDirectory);
	}

	findAllFiles(directory: string, target: string): string[] {
		return glob.sync(path.join(directory, target));
	}
}
