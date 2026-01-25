export interface PortfolioImage {
  path: string,
  description: string,
  alt: string,
  url: string
}

export interface DataTiles {
  title: string,
  descriptions: Array<string>
  images: Array<PortfolioImage>
}

export interface PortFolioData {
  section: string,
  tiles: Array<DataTiles>
}
