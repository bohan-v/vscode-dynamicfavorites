import * as vscode from 'vscode';
import { CategoriesProvider } from './tree_view/categories';
import { CategoryController } from './category_controller';
import { ConfigurationParser } from './configuration_parser';

export function activate(context: vscode.ExtensionContext) {
	let config = vscode.workspace.getConfiguration("dynamicfavorites");
	let rootPatterns = config.get("customRootDirPatterns", []);
	let categoriesPattern = ConfigurationParser.categoryRules(config.get("patterns", []));

	let categoryController = new CategoryController(categoriesPattern, rootPatterns);
	categoryController.updatePath(vscode.window.activeTextEditor?.document.uri.path);

	let provider = categoryController.categoriesProvider;
	vscode.window.createTreeView('dynamicfavorites.tree', { 
		treeDataProvider: provider ?? new CategoriesProvider([])
	});

	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor((editor) => {
			const currentFilePath = editor?.document.uri.path;
			categoryController.updatePath(currentFilePath);
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
