<template>
    <div style="border: 1px solid #0f4c9163; border-radius: 5px; padding: 15px 20px 10px 15px;">
        <v-file-input
                :label="$t('Выберите ЭЦП')"
                accept=".p12"
                :rules="[v => !!v || $t('Выберите ЭЦП')]"
                @change="toBase64"
                required >
        </v-file-input>
        <v-text-field
                :label="$t('Пароль')"
                type="password"
                prepend-icon="mdi-key"
                v-model="ecpPasswordLocal"
                :rules="[v => !!v || $t('Введите пароль')]"
                required
        ></v-text-field>
    </div>
</template>

<script>
    export default {
        props: {
            ecpFileData: {
                //required: true
            },
            ecpPassword: {
                //required: true
            }
        },
        created() {
            this.ecpFileDataLocal = this.ecpFileData;
            this.ecpPasswordLocal = this.ecpPassword;
        },
        data: () => ({
            ecpFileDataLocal: null,
            ecpPasswordLocal: null
        }),
        methods: {
            toBase64(file) {
                this.ecpFileDataLocal = null;
                this.$emit("update-ecp-file-data", this.ecpFileDataLocal);
                if(file) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
                        if ((encoded.length % 4) > 0) {
                            encoded += '='.repeat(4 - (encoded.length % 4));
                        }
                        this.ecpFileDataLocal = encoded;
                        this.$emit("update-ecp-file-data", this.ecpFileDataLocal);
                    };
                }
            }
        },
        watch: {
            ecpPasswordLocal(v) {
                this.$emit("update-ecp-password", v);
            }
        }
    }
</script>