import { expect } from "chai";
import hre from "hardhat";

describe("NFTMarketplace", function () {
  let nftMarketplace;
  let owner;
  let buyer;
  let listingPrice;

  before(async function () {
    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
    [owner, buyer] = await hre.ethers.getSigners();
    nftMarketplace = await NFTMarketplace.deploy();
    listingPrice = await nftMarketplace.getListingPrice();
  });

  it("Should create and execute market sales", async function () {
    const auctionPrice = hre.ethers.parseUnits("1", "ether");

    // Mint and list first token
    await nftMarketplace.createToken("https://www.mytokenlocation.com", auctionPrice, { value: listingPrice });
    
    // Mint and list second token
    await nftMarketplace.createToken("https://www.mytokenlocation2.com", auctionPrice, { value: listingPrice });

    // Buy first token
    await nftMarketplace.connect(buyer).buyMarketItem(1, { value: auctionPrice });

    // Fetch market items
    let items = await nftMarketplace.fetchMarketItems();
    
    // We should have 1 item left unsold
    expect(items.length).to.equal(1);
    expect(items[0].tokenId).to.equal(2n);

    // Fetch buyer's items
    let myItems = await nftMarketplace.connect(buyer).fetchMyNFTs();
    expect(myItems.length).to.equal(1);
    expect(myItems[0].tokenId).to.equal(1n);
  });
});
