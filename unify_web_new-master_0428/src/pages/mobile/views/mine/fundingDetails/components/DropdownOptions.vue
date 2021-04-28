<template>
    <div class='menu-item'>
        <span v-if='option.label' class='label'>
            {{ option.label }}
        </span>
        <div class='child-wrap'>
            <DropdownOption
                v-for='(item, j) in option.child'
                :key='j'
                class='child'
                :is-active='value === item.value'
                :option='item'
                @clicked='onClicked'
            />
            <div v-if='$slots.append' class='child'>
                <slot name='append'></slot>
            </div>
        </div>
    </div>
</template>

<script>
import DropdownOption from './DropdownOption.vue'

export default {
    name: 'DropdownOptions',
    components: {
        DropdownOption
    },
    props: {
        value: {
            type: [Number, String],
            default: ''
        },
        option: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        onClicked (option) {
            this.$emit('input', option.value)
            this.$emit('change', option)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";

.menu-item {
    .label {
        padding-left: rem(29px);
        display: block;
        font-size: rem(26px);
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: rem(36px);
        margin-bottom: rem(18px);
    }

    .child-wrap {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;
        padding-left: rem(29px);
        .child {
            margin-bottom: rem(28px);
            margin-right: rem(29px);
        }
    }
}
</style>
