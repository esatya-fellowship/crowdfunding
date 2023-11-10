export const calculatePercentage = (balance, target) => {
    const ethBalance = weiToEth(balance);
    const ethTarget = weiToEth(target);
    return Math.round((Number(ethBalance) / Number(ethTarget)) * 100);
};

export const calculateDaysLeft = (endDate) => {
    return Math.ceil((Number(endDate) - new Date().getTime()) / 1000 / 60 / 60 / 24);
};

export const ethToWei = (ethAmount) => {
    return window.web3.utils.toWei(ethAmount, 'Ether');
};

export const weiToEth = (weiAmount) => {
    return window.web3.utils.fromWei(weiAmount, 'Ether');
};
