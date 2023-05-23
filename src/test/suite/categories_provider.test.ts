import { describe } from 'mocha';
import { it } from 'mocha';
import { afterEach } from 'mocha';
import { beforeEach } from 'mocha';
import { CategoryNode } from '../../tree_view/category_node';
import { CategoriesProvider } from '../../tree_view/categories';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('CategoriesProvider', () => {
  let provider: CategoriesProvider;
  let nodes: CategoryNode[];
  let spy: sinon.SinonSpy;

  beforeEach(() => {
    nodes = [
      new CategoryNode('Node 1', undefined, [], 'icon1'),
      new CategoryNode('Node 2', undefined, [], 'icon2')
    ];

    provider = new CategoriesProvider(nodes);
    spy = sinon.spy(provider['_onDidChangeTreeData'], 'fire');
  });

  afterEach(() => {
    spy.restore();
  });

  it('should fire onDidChangeTreeData when update is called', () => {
    expect(provider.nodes[0].label).to.equal('Node 1');
    expect(provider.nodes[0].filePath).to.undefined;
    expect(provider.nodes[0].icon).to.equal('icon1');
    expect(provider.nodes[1].label).to.equal('Node 2');
    expect(provider.nodes[1].filePath).to.undefined;
    expect(provider.nodes[1].icon).to.equal('icon2');

    provider.update([]);
    expect(spy.calledOnce).to.be.true;
    expect(provider.nodes.length).to.equal(0);
  });
});
