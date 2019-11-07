<template>
    <div>
        membresias table
    </div>
</template>

<script>
export default {
    name: 'membresias-table',
    components: {
    },
    data() {
        return {
            columns: ['id', 'nombre', 'precio'],
            data: [ {id: 1, nombre: 'Test 1', precio: 1500}]
        }
    }

}
</script>

<style>

</style>