var booking = {
    3: {
        1: {
            900: 1,
            930: 1,
            1000: 1,
            1030: 0,
        }
    }
}

let target = booking[3][1][930];
if (target) console.log(target);