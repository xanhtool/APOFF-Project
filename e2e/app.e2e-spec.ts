import { QuyenAnhProjectPage } from './app.po';

describe('quyen-anh-project App', () => {
  let page: QuyenAnhProjectPage;

  beforeEach(() => {
    page = new QuyenAnhProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
