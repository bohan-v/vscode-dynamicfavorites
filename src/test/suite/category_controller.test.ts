import { describe } from 'mocha';
import { it } from 'mocha';
import { afterEach } from 'mocha';
import { beforeEach } from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as fs from 'fs';
import * as glob from 'glob';

import { CategoryController } from '../../category_controller';
import { CategoryRule } from '../../settings/category_rule';

let expect = chai.expect;
describe("CategoryControllerTests", () => {
	let globStub: sinon.SinonStub<[pattern: string, options?: glob.IOptions | undefined], string[]> | undefined = undefined;
	let fsStub: sinon.SinonStub<[path: fs.PathLike], boolean> | undefined = undefined;
	let categoryControllerStub: sinon.SinonStub<[directory: string], string | undefined> | undefined = undefined;
	let categoryControllerStub2: sinon.SinonStub<[directory: string, target: string], string[]> | undefined = undefined;

	beforeEach(() => {
		globStub = undefined;
		fsStub = undefined;
		categoryControllerStub = undefined;
		categoryControllerStub2 = undefined;
	});

	afterEach(() => {
		globStub?.restore();
		fsStub?.restore();
		categoryControllerStub?.restore();
		categoryControllerStub2?.restore();
	});

	describe("test categoriesProvider", () => {
		it("should return empty node", () => {
			let categoryController = new CategoryController(createCategoryRules(), createRootDirPatterns());
			expect(categoryController.categoriesProvider).to.be.undefined;
			categoryController.getCategoriesProvider(undefined);
			expect(categoryController.categoriesProvider).to.be.exist;
			expect(categoryController.categoriesProvider?.nodes.length).to.be.equal(0);
		});

		it("should find no files", () => {
			let categoryController = new CategoryController(createCategoryRules(), createRootDirPatterns());
			categoryControllerStub = sinon.stub(categoryController, "findRootDir");
			categoryControllerStub.returns("/test/path");
			categoryControllerStub2 = sinon.stub(categoryController, "findAllFiles");
			categoryControllerStub2
				.withArgs("/test/path", "pattern")
				.returns([])
				.withArgs("/test/path", "pattern2")
				.returns([]);

			categoryController.getCategoriesProvider("/test/path");
			expect(categoryController.categoriesProvider).to.be.exist;
			expect(categoryController.categoriesProvider?.nodes.length).to.be.equal(2);
			expect(categoryController.categoriesProvider?.nodes[0].label).to.be.equal("sectionLabel");
			expect(categoryController.categoriesProvider?.nodes[0].filePath).to.be.undefined;
			expect(categoryController.categoriesProvider?.nodes[0].icon).to.be.equal("iconName");
			expect(categoryController.categoriesProvider?.nodes[0].children.length).to.be.equal(0);

			expect(categoryController.categoriesProvider?.nodes[1].label).to.be.equal("sectionLabel2");
			expect(categoryController.categoriesProvider?.nodes[1].filePath).to.be.undefined;
			expect(categoryController.categoriesProvider?.nodes[1].icon).to.be.equal("iconName2");
			expect(categoryController.categoriesProvider?.nodes[1].children.length).to.be.equal(0);
		});

		it("should return nodes", () => {
			fsStub = sinon.stub(fs, "existsSync");
			fsStub.returns(true);

			globStub = sinon.stub(glob, "sync");
			globStub.returns(["home/file.swift", "store/file2.swift"]);

			let categoryController = new CategoryController(createCategoryRules(), createRootDirPatterns());
			categoryController.getCategoriesProvider("/test/path");
			expect(categoryController.categoriesProvider).to.be.exist;
			expect(categoryController.categoriesProvider?.nodes.length).to.be.equal(2);
			expect(categoryController.categoriesProvider?.nodes[0].label).to.be.equal("sectionLabel");
			expect(categoryController.categoriesProvider?.nodes[0].filePath).to.be.undefined;
			expect(categoryController.categoriesProvider?.nodes[0].icon).to.be.equal("iconName");
			expect(categoryController.categoriesProvider?.nodes[0].children.length).to.be.equal(2);
			expect(categoryController.categoriesProvider?.nodes[0].children[0].children).to.be.empty;
			expect(categoryController.categoriesProvider?.nodes[0].children[0].label).to.be.equal("file.swift");
			expect(categoryController.categoriesProvider?.nodes[0].children[0].filePath).to.be.equal("home/file.swift");
			expect(categoryController.categoriesProvider?.nodes[0].children[0].icon).to.be.undefined;

			expect(categoryController.categoriesProvider?.nodes[0].children[1].children).to.be.empty;
			expect(categoryController.categoriesProvider?.nodes[0].children[1].label).to.be.equal("file2.swift");
			expect(categoryController.categoriesProvider?.nodes[0].children[1].filePath).to.be.equal("store/file2.swift");
			expect(categoryController.categoriesProvider?.nodes[0].children[1].icon).to.be.undefined;

			expect(categoryController.categoriesProvider?.nodes[1].label).to.be.equal("sectionLabel2");
		});
	});

	describe("test findRootDir", () => {
		it("should return root dir", () => {
			globStub = sinon.stub(glob, "sync");
			globStub.withArgs("/test/path/test.swift/root_pattern1").returns(["/test/path/test.swift"]);
			globStub.withArgs("/test/path/test.swift/root_pattern2").returns([]);
			globStub.withArgs("/test/path/root_pattern1").returns(["/test/path/test.swift"]);
			globStub.withArgs("/test/path/root_pattern2").returns(["/test/path/test.swift"]);

			fsStub = sinon.stub(fs, "existsSync").returns(true);
			let categoryController = new CategoryController(createCategoryRules(), createRootDirPatterns());
			expect(categoryController.findRootDir("/test/path/test.swift")).to.be.equal("/test/path");
		});

		it("should return root dir 2", () => {
			globStub = sinon.stub(glob, "sync");
			globStub
				.withArgs("/test/path/test.swift/root_pattern1")
				.returns([])
				.withArgs("/test/path/test.swift/root_pattern2")
				.returns([])
				.withArgs("/test/path/root_pattern1")
				.returns([])
				.withArgs("/test/path/root_pattern2")
				.returns([])
				.withArgs("/test/root_pattern1")
				.returns([])
				.withArgs("/test/root_pattern2")
				.returns([])
				.withArgs("/root_pattern1")
				.returns([])
				.withArgs("/root_pattern2")
				.returns([]);

			fsStub = sinon.stub(fs, "existsSync").returns(true);
			let categoryController = new CategoryController(createCategoryRules(), createRootDirPatterns());
			expect(categoryController.findRootDir("/test/path/test.swift")).to.be.undefined;
		});
	});
});

function createCategoryRules(): CategoryRule[] {
	return [
		new CategoryRule("sectionLabel", "pattern", "iconName"),
		new CategoryRule("sectionLabel2", "pattern2", "iconName2"),
	];
}

function createRootDirPatterns(): string[] {
	return ["root_pattern1", "root_pattern2"];
}
