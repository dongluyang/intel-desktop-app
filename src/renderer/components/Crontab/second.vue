<template>
    <a-form size="small">
        <a-form-item>
            <a-radio v-model='radioValue' :value="1">
                秒，允许的通配符[, - * /]
            </a-radio>
        </a-form-item>

        <a-form-item>
            <a-radio v-model='radioValue' :value="2">
                周期从
                <a-input-number v-model='cycle01' :min="0" :max="58" /> -
                <a-input-number v-model='cycle02' :min="cycle01 + 1" :max="59" /> 秒
            </a-radio>
        </a-form-item>

        <a-form-item>
            <a-radio v-model='radioValue' :value="3">
                从
                <a-input-number v-model='average01' :min="0" :max="58" /> 秒开始，每
                <a-input-number v-model='average02' :min="1" :max="59 - average01" /> 秒执行一次
            </a-radio>
        </a-form-item>

        <a-form-item>
            <a-radio v-model='radioValue' :value="4">
                指定
            </a-radio>
            <a-select allow-clear v-model="checkboxList" placeholder="可多选" multiple :scrollbar="scrollbar">
              <a-option v-for="item in 60" :index="item" :value="item - 1">{{item - 1}}</a-option>
            </a-select>
        </a-form-item>
    </a-form>
</template>

<script setup>
import { defineEmits,ref,computed,watch,onMounted,defineProps   } from 'vue';
const emit = defineEmits(['update'])
const props = defineProps({
    cron: {
        type: Object,
        default: {
            second: "*",
            min: "*",
            hour: "*",
            day: "*",
            month: "*",
            week: "*",
            year: "",
        }
    },
    check: {
        type: Function,
        default: () => {
        }
    }
})
const radioValue = ref()
const cycle01 = ref(0)
const cycle02 = ref(1)
const average01 = ref(0)
const average02 = ref(1)
const checkboxList = ref([])
const checkCopy = ref([])
const scrollbar = ref(true);
const cycleTotal = computed(() => {
    cycle01.value = props.check(cycle01.value, 0, 58)
    cycle02.value = props.check(cycle02.value, cycle01.value + 1, 59)
    return cycle01.value + '-' + cycle02.value
})
const averageTotal = computed(() => {
    average01.value = props.check(average01.value, 0, 58)
    average02.value = props.check(average02.value, 1, 59 - average01.value)
    return average01.value + '/' + average02.value
})
const checkboxString = computed(() => {
    return checkboxList.value.join(',')
})
watch(() => props.cron.second, value => changeRadioValue(value))
watch([radioValue, cycleTotal, averageTotal, checkboxString], () => onRadioChange())
function changeRadioValue(value) {
    if (value === '*') {
        radioValue.value = 1
    } else if (value.indexOf('-') > -1) {
        const indexArr = value.split('-')
        cycle01.value = Number(indexArr[0])
        cycle02.value = Number(indexArr[1])
        radioValue.value = 2
    } else if (value.indexOf('/') > -1) {
        const indexArr = value.split('/')
        average01.value = Number(indexArr[0])
        average02.value = Number(indexArr[1])
        radioValue.value = 3
    } else {
        checkboxList.value = [...new Set(value.split(',').map(item => Number(item)))]
        radioValue.value = 4
    }
}
// 单选按钮值变化时
function onRadioChange() {
    switch (radioValue.value) {
        case 1:
            emit('update', 'second', '*', 'second')
            break
        case 2:
            emit('update', 'second', cycleTotal.value, 'second')
            break
        case 3:
            emit('update', 'second', averageTotal.value, 'second')
            break
        case 4:
            if (checkboxList.value.length === 0) {
              //  checkboxList.value.push(checkCopy.value[0])
            } else {
                checkCopy.value = checkboxList.value
            }
            emit('update', 'second', checkboxString.value, 'second')
            break
    }
}
</script>

<style lang="scss" scoped>
.a-input-number--small, .a-select, .a-select--small {
    margin: 0 0.2rem;
}
.a-select, .a-select--small {
    width: 18.8rem;
}
</style>