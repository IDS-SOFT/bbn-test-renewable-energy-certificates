const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('EnvironmentalAsset', function () {
  let EnvironmentalAsset:any;
  let environmentalAsset:any;
  let owner:any;
  let recipient:any;
  let otherAccount:any;

  const assetName = 'Renewable Energy Certificate';
  const assetType = 'Energy';
  const initialSupply = 1000;
  const assetPrice = 100; // Price in wei
  const expirationDate = Math.floor(Date.now() / 1000) + 3600; // Expiration in one hour

  beforeEach(async function () {
    [owner, recipient, otherAccount] = await ethers.getSigners();

    // Deploy the EnvironmentalAsset contract
    EnvironmentalAsset = await ethers.getContractFactory('EnvironmentalAsset');
    environmentalAsset = await EnvironmentalAsset.deploy(assetName, assetType, initialSupply, assetPrice, expirationDate);

    // Wait for the contract to be mined
    await environmentalAsset.deployed();
  });

  it('should have the correct initial values', async function () {
    expect(await environmentalAsset.assetName()).to.equal(assetName);
    expect(await environmentalAsset.assetType()).to.equal(assetType);
    expect(await environmentalAsset.totalSupply()).to.equal(initialSupply);
    expect(await environmentalAsset.availableSupply()).to.equal(initialSupply);
    expect(await environmentalAsset.assetPrice()).to.equal(assetPrice);
    expect(await environmentalAsset.expirationDate()).to.equal(expirationDate);
    expect(await environmentalAsset.issuer()).to.equal(owner.address);
  });

  it('should allow minting assets by the owner', async function () {
    const amountToMint = 100;

    await environmentalAsset.connect(owner).mintAsset(recipient.address, amountToMint);

    expect(await environmentalAsset.balances(recipient.address)).to.equal(amountToMint);
    expect(await environmentalAsset.availableSupply()).to.equal(initialSupply - amountToMint);
  });

  it('should not allow minting assets if the owner is not calling', async function () {
    const amountToMint = 100;

    await expect(environmentalAsset.connect(otherAccount).mintAsset(recipient.address, amountToMint)).to.be.revertedWith(
      'only owner can call this function'
    );
  });

  it('should not allow minting assets if there is insufficient available supply', async function () {
    const amountToMint = initialSupply + 1;

    await expect(environmentalAsset.connect(owner).mintAsset(recipient.address, amountToMint)).to.be.revertedWith(
      'Insufficient available supply'
    );
  });

  it('should allow transferring assets between accounts', async function () {
    const amountToMint = 100;
    await environmentalAsset.connect(owner).mintAsset(recipient.address, amountToMint);

    const transferAmount = 50;
    await environmentalAsset.connect(recipient).transferAsset(otherAccount.address, transferAmount);

    expect(await environmentalAsset.balances(recipient.address)).to.equal(amountToMint - transferAmount);
    expect(await environmentalAsset.balances(otherAccount.address)).to.equal(transferAmount);
  });

  it('should not allow transferring assets if the sender has insufficient balance', async function () {
    const amountToMint = 100;
    await environmentalAsset.connect(owner).mintAsset(recipient.address, amountToMint);

    const transferAmount = amountToMint + 1;

    await expect(environmentalAsset.connect(recipient).transferAsset(otherAccount.address, transferAmount)).to.be.revertedWith(
      'Insufficient balance'
    );
  });

  it('should allow revoking assets after the expiration date', async function () {
    // Set the expiration date to a past timestamp
    const pastExpirationDate = Math.floor(Date.now() / 1000) - 3600;
    const environmentalAssetPast = await EnvironmentalAsset.deploy(assetName, assetType, initialSupply, assetPrice, pastExpirationDate);
    await environmentalAssetPast.deployed();

    await environmentalAssetPast.connect(owner).revokeAsset();
    
    let errorOccurred = false;

    try {
        await environmentalAssetPast.connect(owner).revokeAsset();
        expect(await environmentalAssetPast.balances(owner.address)).to.not.equal(0);
    } catch (error) {
        // If an error occurs, set the errorOccurred flag to true
        errorOccurred = true;
    }
    expect(errorOccurred).to.equal(true);
  });

  it('should not allow revoking assets before the expiration date', async function () {
    await expect(environmentalAsset.connect(owner).revokeAsset()).to.be.revertedWith('Asset cannot be revoked before expiration');
  });
});
