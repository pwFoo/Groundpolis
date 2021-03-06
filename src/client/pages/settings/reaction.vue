<template>
<FormBase>
	<FormSwitch v-model:value="emojiPickerShowPinnedEmojis">{{ $ts.emojiPickerShowPinnedEmojis }}</FormSwitch>

	<div class="_formItem" v-if="emojiPickerShowPinnedEmojis">
		<div class="_formLabel">{{ $ts.reactionSettingDescription }}</div>
		<div class="_formPanel">
			<XDraggable class="zoaiodol" v-model="reactions" :item-key="item => item" animation="150" delay="100" delay-on-touch-only="true">
				<template #item="{element}">
					<button class="_button item" @click="remove(element, $event)">
						<MkEmoji :emoji="element" :normal="true"/>
					</button>
				</template>
				<template #footer>
					<button class="_button add" @click="chooseEmoji"><Fa :icon="faPlus"/></button>
				</template>
			</XDraggable>
		</div>
		<div class="_formCaption" v-text="$ts.reactionSettingDescription2" />
		<FormButton danger @click="setDefault"><Fa :icon="faUndo"/> {{ $ts.default }}</FormButton>
	</div>
	<FormGroup>
		<FormSwitch v-model:value="emojiPickerShowRecentEmojis">{{ $ts.emojiPickerShowRecentEmojis }}</FormSwitch>
		<FormButton v-if="emojiPickerShowRecentEmojis" @click="clearRecent" danger><Fa :icon="faTrashAlt"/> {{ $ts.clearHistories }}</FormButton>
	</FormGroup>
	<FormRadios v-model="reactionPickerWidth">
		<template #desc>{{ $ts.width }}</template>
		<option :value="1">{{ $ts.small }}</option>
		<option :value="2">{{ $ts.medium }}</option>
		<option :value="3">{{ $ts.large }}</option>
	</FormRadios>
	<FormRadios v-model="reactionPickerHeight">
		<template #desc>{{ $ts.height }}</template>
		<option :value="1">{{ $ts.small }}</option>
		<option :value="2">{{ $ts.medium }}</option>
		<option :value="3">{{ $ts.large }}</option>
	</FormRadios>
	<FormButton @click="preview"><Fa :icon="faEye"/> {{ $ts.preview }}</FormButton>
</FormBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { faLaugh, faSave, faEye } from '@fortawesome/free-regular-svg-icons';
import { faUndo, faPlus } from '@fortawesome/free-solid-svg-icons';
import XDraggable from 'vuedraggable';
import FormInput from '@/components/form/input.vue';
import FormSwitch from '@/components/form/switch.vue';
import FormGroup from '@/components/form/group.vue';
import FormRadios from '@/components/form/radios.vue';
import FormBase from '@/components/form/base.vue';
import FormButton from '@/components/form/button.vue';
import * as os from '@/os';
import { defaultStore } from '@/store';

export default defineComponent({
	components: {
		FormInput,
		FormButton,
		FormBase,
		FormRadios,
		FormSwitch,
		FormGroup,
		XDraggable,
	},

	data() {
		return {
			reactions: JSON.parse(JSON.stringify(this.$store.state.reactions)),
			faLaugh, faSave, faEye, faUndo, faPlus
		}
	},

	computed: {
		reactionPickerWidth: defaultStore.makeGetterSetter('reactionPickerWidth'),
		reactionPickerHeight: defaultStore.makeGetterSetter('reactionPickerHeight'),
		emojiPickerShowPinnedEmojis: defaultStore.makeGetterSetter('emojiPickerHidePinnedEmojis', v => !v, v => !v),
		emojiPickerShowRecentEmojis: defaultStore.makeGetterSetter('emojiPickerHideRecentEmojis', v => !v, v => !v),
	},

	watch: {
		reactions: {
			handler() {
				this.save();
			},
			deep: true
		}
	},

	mounted() {
		this.$emit('info', this.INFO);
	},

	methods: {
		save() {
			this.$store.set('reactions', this.reactions);
		},

		remove(reaction, ev) {
			os.modalMenu([{
				text: this.$ts.remove,
				action: () => {
					this.reactions = this.reactions.filter(x => x !== reaction)
				}
			}], ev.currentTarget || ev.target);
		},

		preview(ev) {
			os.reactionPicker({
				showFocus: false,
				src: ev.currentTarget || ev.target,
			});
		},

		async setDefault() {
			const { canceled } = await os.dialog({
				type: 'warning',
				text: this.$ts.resetAreYouSure,
				showCancelButton: true
			});
			if (canceled) return;

			this.reactions = JSON.parse(JSON.stringify(this.$store.def.reactions.default));
		},

		async clearRecent() {
			const { canceled } = await os.dialog({
				type: 'warning',
				text: this.$ts.resetAreYouSure,
				showCancelButton: true
			});
			if (canceled) return;

			this.$store.set('recentlyUsedEmojis', []);
		},

		chooseEmoji(ev) {
			os.pickEmoji(ev.currentTarget || ev.target, {
				showPinned: false
			}).then(emoji => {
				if (!this.reactions.includes(emoji)) {
					this.reactions.push(emoji);
				}
			});
		}
	}
});
</script>

<style lang="scss" scoped>
.zoaiodol {
	padding: 16px;

	> .item {
		display: inline-block;
		padding: 8px;
		cursor: move;
	}

	> .add {
		display: inline-block;
		padding: 8px;
	}
}
</style>
