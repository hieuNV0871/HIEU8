<template>
    <div>
        <!-- <button @click="()=>handle(a)">+++</button> -->
        <button @click="handle(a)">+++</button>
    </div>
</template>

<script setup>
const a = ref("a")

const handle = ($event, a) => {
    console.log("san pham so mot".replace(/\s+/g, '').toLowerCase());
    console.log($event);
    
}

function convertToAbbreviation(inputString) {
    const words = inputString.split(' ');

    // Lặp qua mỗi từ và thực hiện điều chỉnh
    const abbreviation = words.map((word, index) => {
        if (index === words.length - 1) {
            // Nếu là từ cuối cùng, giữ nguyên chữ cuối cùng
            return word;
        } else {
            // Ngược lại, lấy kí tự đầu tiên
            return word.charAt(0);
        }
    }).join('');

    return abbreviation;
}

const input = "san pham so mot";
const output = input.split(' ').map((word, index, array) => index === array.length - 1 ? word : word.charAt(0)).join('');

console.log(output); // Kết quả: spsmt
</script>

<style>

</style>