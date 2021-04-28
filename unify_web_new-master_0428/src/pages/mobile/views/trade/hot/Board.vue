<template>
    <div class='m-board' :class="{ 'green': number>=0,'red':number<0 }">
        <img alt src='../../../assets/board2.svg' />
        <div class='pointer' :style='{ transform:rotate }'></div>
        <div class='color'></div>
    </div>
</template>

<script>
export default {
    name: 'Board',
    props: {
        number: {
            default: 0
        }
    },
    computed: {
        rotate () {
            const _number = Math.abs(parseFloat(this.number)).toFixed(2)
            let _rotate = -90
            if (_number <= 1) {
                _rotate = -90 + (_number) * 90
            } else if (_number > 1 && _number <= 2) {
                _rotate = 45 / (_number - 1)
            } else {
                console.log(this.number)
                _rotate = 45 + Math.abs(4.5 * (_number - 2))
            }
            return `rotate(${_rotate.toFixed(2) >= 85 ? 85 : _rotate.toFixed(2)}deg)`
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.m-board {
    position: relative;
    width: rem(120px);
    height: rem(65px);
    &::before {
        z-index: 10;
        position: absolute;
        content: "";
        background-color: rgba(#949494, 0.7);
        bottom: rem(5px);
        left: 50%;
        margin-left: rem(-10px);
        border-radius: rem(10px) rem(10px) 0 0;
        width: rem(20px);
        height: rem(10px);
        overflow: hidden;
    }
    img {
        width: 100%;
        height: auto;
    }
    .pointer {
        position: absolute;

        display: inline-block;
        width: 1px;
        height: rem(36px);
        left: 49.4%;
        bottom: rem(6px);
        transform-origin: bottom center;
        z-index: 9;
    }
    .color {
        position: absolute;
        bottom: rem(6px);
        z-index: 4;
        left: rem(25px);
        width: rem(70px);
        height: rem(36px);
        border-radius: rem(35px) rem(35px) 0 0;
        overflow: hidden;
    }
    &.red {
        .pointer {
            background-color: #e3525c;
        }
        .color {
            background: linear-gradient(to right, #fff, #e3525c);
        }
    }
    &.green {
        .pointer {
            background-color: #10b873;
        }
        .color {
            background: linear-gradient(to right, #fff, #10b873);
        }
    }
}
</style>
