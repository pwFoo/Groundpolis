<template>
<div class="lzyxtsnt">
	<img v-if="image" :src="image.url"/>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as os from '@/os';

export default defineComponent({
	props: {
		value: {
			required: true
		},
		page: {
			required: true
		},
	},
	data() {
		return {
			image: null,
		};
	},
	created() {
		this.image = this.page.attachedFiles.find(x => x.id === this.value.fileId);
	}
});
</script>

<style lang="scss" scoped>
.lzyxtsnt {
	> img {
		max-width: 100%;
	}
}
</style>
