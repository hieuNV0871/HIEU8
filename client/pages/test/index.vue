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

    
    const abbreviation = words.map((word, index) => {
        if (index === words.length - 1) {

            return word;
        } else {
           
            return word.charAt(0);
        }
    }).join('');

    return abbreviation;
}

const input = "san pham so mot";
const output = input.split(' ').map((word, index, array) => index === array.length - 1 ? word : word.charAt(0)).join('');

console.log(output); 
</script>

<style>

</style>