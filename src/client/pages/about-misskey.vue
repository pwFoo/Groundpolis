<template>
<div style="overflow: hidden;">
	<FormBase class="znqjceqz">
		<FormGroup>
			<section class="_formItem about">
				<div class="_formPanel panel" :class="{ playing: easterEggEngine != null }" ref="about">
					<div class="icon" ref="icon" draggable="false">
						<img src="/assets/icon_transparent.svg" :class="{awesome}" @load="iconLoaded" alt="" draggable="false"/>
					</div>
					<div class="groundpolis" :class="{awesome}">Groundpolis</div>
					<div class="version" :class="{awesome}">v{{ version }}</div>
					<span
						class="emoji"
						v-for="emoji in easterEggEmojis"
						:key="emoji.id"
						:data-physics-x="emoji.left"
						:data-physics-y="emoji.top"
						:class="{ _physics_circle_: !emoji.emoji.startsWith(':') }"
					>
						<MkEmoji
							class="emoji"
							:emoji="emoji.emoji"
							:custom-emojis="$instance.emojis"
							:is-reaction="false"
							:normal="true"
							:no-style="true"
						/>
					</span>
				</div>
			</section>
			<FormLink :to="`https://github.com/Groundpolis/Groundpolis/releases/tag/${version}`" external>
				{{ $ts._aboutMisskey.releaseNote }}
			</FormLink>
		</FormGroup>
		<section class="_formItem" style="text-align: center; padding: 0 16px;" @click="gravity">
			{{ $ts._aboutMisskey.about }}
		</section>
		<FormGroup>
			<FormLink to="https://github.com/Groundpolis/Groundpolis" external>
				<template #icon><Fa :icon="faCode"/></template>
				{{ $ts._aboutMisskey.source }}
			</FormLink>
			<FormLink to="https://github.com/syuilo/misskey" external>
				<template #icon><Fa :icon="faCode"/></template>
				{{ $ts._aboutMisskey.sourceMisskey }}
			</FormLink>
			<FormLink to="https://www.patreon.com/syuilo" external>
				<template #icon><Fa :icon="faHandHoldingMedical"/></template>
				{{ $ts._aboutMisskey.donate }}
			</FormLink>
		</FormGroup>
		<FormGroup>
			<template #label>{{ $ts._aboutMisskey.contributors }}</template>
			<FormLink to="https://github.com/Xeltica" external>@Xeltica</FormLink>
			<FormLink to="https://github.com/m-hayabusa" external>@m-hayabusa</FormLink>
			<template #caption><MkLink url="https://github.com/Groundpolis/Groundpolis/graphs/contributors">{{ $ts._aboutMisskey.allContributors }}</MkLink></template>
		</FormGroup>
		<FormGroup>
			<template #label>{{ $ts._aboutMisskey.contributorsMisskey }}</template>
			<FormLink to="https://github.com/syuilo" external>@syuilo</FormLink>
			<FormLink to="https://github.com/AyaMorisawa" external>@AyaMorisawa</FormLink>
			<FormLink to="https://github.com/mei23" external>@mei23</FormLink>
			<FormLink to="https://github.com/acid-chicken" external>@acid-chicken</FormLink>
			<FormLink to="https://github.com/tamaina" external>@tamaina</FormLink>
			<FormLink to="https://github.com/rinsuki" external>@rinsuki</FormLink>
			<FormLink to="https://github.com/Xeltica" external>@Xeltica</FormLink>
			<FormLink to="https://github.com/u1-liquid" external>@u1-liquid</FormLink>
			<template #caption><MkLink url="https://github.com/syuilo/misskey/graphs/contributors">{{ $ts._aboutMisskey.allContributors }}</MkLink></template>
		</FormGroup>
		<FormGroup>
			<template #label><Mfm text="[jelly ❤]"/> {{ $ts._aboutMisskey.patrons }}</template>
			<FormKeyValueView v-for="patron in patrons" :key="patron"><template #key>{{ patron }}</template></FormKeyValueView>
			<template #caption>{{ $ts._aboutMisskey.morePatrons }}</template>
		</FormGroup>
	</FormBase>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { faInfoCircle, faCode, faLanguage, faHandHoldingMedical, } from '@fortawesome/free-solid-svg-icons';
import VanillaTilt from 'vanilla-tilt';
import { version } from '@/config';
import FormLink from '@/components/form/link.vue';
import FormBase from '@/components/form/base.vue';
import FormGroup from '@/components/form/group.vue';
import FormKeyValueView from '@/components/form/key-value-view.vue';
import MkLink from '@/components/link.vue';
import { physics } from '@/scripts/physics.ts';
import * as os from '@/os';

const patrons = [
	'Satsuki Yanagi',
	'noellabo',
	'Gargron',
	'Atsuko Tominaga',
	'AureoleArk',
	'naga_rus',
	'Melilot',
	'Hekovic',
	'Nokotaro Takeda',
	'dansup',
	'nenohi',
	'motcha',
	'nanami kan',
	'Eduardo Quiros',
	'Peter G.',
	'YUKIMOCHI',
	'Efertone',
	'makokunsan',
	'mewl hayabusa',
	'見当かなみ',
	'natalie',
	'takimura',
	'sikyosyounin',
	'weepjp',
	'mydarkstar',
	'Nesakko',
	'sheeta.s',
	'osapon',
	'YuzuRyo61',
	'wara',
	'mkatze',
	'kiritan',
	'CG',
	'Denshi',
	'Osushimaru',
	'Liaizon Wakest',
];

export default defineComponent({
	components: {
		FormBase,
		FormGroup,
		FormLink,
		FormKeyValueView,
		MkLink,
	},

	data() {
		return {
			INFO: {
				title: this.$ts.aboutMisskey,
				icon: null
			},
			version,
			patrons,
			easterEggReady: false,
			easterEggEmojis: [],
			easterEggEngine: null,
			awesome: false,
			faInfoCircle, faCode, faLanguage, faHandHoldingMedical,
		}
	},

	mounted() {
		VanillaTilt.init(this.$refs.icon, {
			max: 30,
			perspective: 500,
			scale: 1.125,
			speed: 1000,
		});
	},

	beforeUnmount() {
		if (this.easterEggEngine) {
			this.easterEggEngine.stop();
		}
	},

	methods: {
		iconLoaded() {
			const emojis = this.$store.state.reactions;
			const containerWidth = this.$refs.about.offsetWidth;
			for (let i = 0; i < 64; i++) {
				this.easterEggEmojis.push({
					id: i.toString(),
					top: -(128 + (Math.random() * 256)),
					left: (Math.random() * containerWidth),
					emoji: emojis[Math.floor(Math.random() * emojis.length)],
				});
			}

			this.$nextTick(() => {
				this.easterEggReady = true;
			});
		},

		gravity() {
			if (!this.easterEggReady) return;
			this.awesome = true;
			this.easterEggReady = false;
			this.$refs.icon.vanillaTilt.destroy();
			this.easterEggEngine = physics(this.$refs.about);
		}
	}
});
</script>

<style lang="scss" scoped>
.znqjceqz {
	max-width: 800px;
	box-sizing: border-box;
	margin: 0 auto;

	.about {
		> .panel {
			position: relative;
			text-align: center;
			padding: 16px;

			&.playing {
				&, * {
					user-select: none;
				}

				* {
					will-change: transform;
				}

				> .emoji {
					visibility: visible;
				}
			}

			> .icon {
				display: block;
				width: 100px;
				margin: 0 auto;
				border-radius: 16px;
				background: #251a10;
				transform-style: preserve-3d;
				

				> img {
					width: 100%;
					height: 100%;
					transform: translate3d(0, 4px, 32px) scale(0.9);
				}
			}

			> .groundpolis {
				margin: 0.75em auto 0.3em auto;
				width: max-content;
				font-size: 24px;
				font-weight: bold;
			}

			> .version {
				margin: 0 auto;
				width: max-content;
				opacity: 0.5;
			}

			> .awesome {
				animation: mfm-rainbow 1s linear infinite both;
				opacity: 1;
				color: var(--accent);
			}

			> .emoji {
				position: absolute;
				top: 0;
				left: 0;
				visibility: hidden;

				> .emoji {
					pointer-events: none;
					font-size: 24px;
					width: 24px;
				}
			}
		}
	}
}
</style>
