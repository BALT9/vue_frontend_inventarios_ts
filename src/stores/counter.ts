import { defineStore } from 'pinia'

export const useCounterStore = defineStore('contador', {
    state: () => {
        return {contador : 0}
    },

    actions: {
        incrementar(){
            this.contador++;
        },
        decrementar(){
            this.contador--;
        }
    }
});