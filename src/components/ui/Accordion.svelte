<script lang="ts">
	interface Item {
		id: string;
		question: string;
		answer: string;
	}

	interface Props {
		items: Item[];
	}

	let { items }: Props = $props();

	let openId = $state<string | null>(null);

	const toggle = (id: string): void => {
		openId = openId === id ? null : id;
	};
</script>

<div class="accordion">
	{#each items as item (item.id)}
		<div class="accordion__item" class:accordion__item--open={openId === item.id}>
			<button
				class="accordion__trigger"
				aria-expanded={openId === item.id}
				aria-controls="panel-{item.id}"
				onclick={() => toggle(item.id)}
			>
				<span>{item.question}</span>
				<svg
					class="accordion__chevron"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
			</button>
			{#if openId === item.id}
				<div class="accordion__panel" id="panel-{item.id}">{item.answer}</div>
			{/if}
		</div>
	{/each}
</div>

<style lang="scss">
	.accordion {
		display: flex;
		flex-direction: column;
		gap: 16px;

		&__item {
			background: var(--gray-50);
			border: 1px solid var(--gray-200);
			border-radius: var(--radius-2xl);
			padding: 0 24px;
			transition: border-color 0.2s ease;

			&--open {
				border-color: var(--brand);
			}
		}

		&__trigger {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 16px;
			width: 100%;
			padding: 24px 0;
			background: none;
			border: none;
			text-align: left;
			font-weight: 600;
			color: var(--gray-900);
		}

		&__chevron {
			flex-shrink: 0;
			transition: transform 0.2s ease;
			color: var(--gray-500);
		}

		&__item--open &__chevron {
			transform: rotate(180deg);
		}

		&__panel {
			padding-bottom: 24px;
			color: var(--gray-600);
			line-height: 1.625;
		}
	}
</style>
