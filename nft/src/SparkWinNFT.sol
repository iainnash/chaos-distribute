// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/utils/Counters.sol";

contract SparkWinNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address allowedMinter;

    constructor(address _allowedMinter) ERC721("TestThing", "TSTTNG") {
        allowedMinter = _allowedMinter;
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overridden in child contracts.
     */
    function _baseURI() internal override view virtual returns (string memory) {
        return "https://chaos-distribute.vercel.app/api/nft/";
    }

    function mint(address recipient)
        public
        returns (uint256)
    {
        if (msg.sender != allowedMinter) {
            revert("not allowed");
        }

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);

        _tokenIds.increment();
        return newItemId;
    }
}