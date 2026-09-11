<script>
	// Svelte 5 props definition
	let { 
		// isOpen = $bindable(false), 
		isOpen = false, 
		onclose, 
		header, 
		children 
	} = $props();

	// Tracks the absolute pixel position of the dialog box
	let x = $state(20);
	let y = $state(80);

	// Svelte custom action to manage mouse dragging mechanics
	function drag(node) {
		let isDragging = false;
		let startX, startY;

		function handleMousedown(e) {
			// Don't drag if clicking buttons inside the header
			if (e.target.closest('button')) return;
			
			isDragging = true;
			startX = e.clientX - x;
			startY = e.clientY - y;
			
			window.addEventListener('mousemove', handleMousemove);
			window.addEventListener('mouseup', handleMouseup);
		}

		function handleMousemove(e) {
			if (!isDragging) return;
			x = e.clientX - startX;
			y = e.clientY - startY;
		}

		function handleMouseup() {
			isDragging = false;
			window.removeEventListener('mousemove', handleMousemove);
			window.removeEventListener('mouseup', handleMouseup);
		}

		node.addEventListener('mousedown', handleMousedown);

		return {
			destroy() {
				node.removeEventListener('mousedown', handleMousedown);
				window.removeEventListener('mousemove', handleMousemove);
				window.removeEventListener('mouseup', handleMouseup);
			}
		};
	}
</script>

{#if isOpen}
	<!-- Inline styles dynamically bind the dynamic x and y coordinates -->
	<div 
		style="left: {x}px; top: {y}px;"
		class="absolute z-50 flex w-max flex-col rounded-lg border border-gray-200 bg-white shadow-xl select-none"
	>
		
		<!-- Header Section: Host of the use:drag action and grab cursor -->
		<div 
			use:drag
			class="flex cursor-grab items-center justify-between border-b border-gray-100 px-4 py-3 active:cursor-grabbing bg-gray-50 rounded-t-lg"
		>
			<div class="text-base font-semibold text-gray-800">
				{#if header}
					{@render header()}
				{:else}
					<span>Notification</span>
				{/if}
			</div>
			<button 
				onclick={onclose} 
				class="p-1 text-2xl font-light leading-none text-gray-400 hover:text-gray-700 focus:outline-none" 
				aria-label="Close dialog"
			>
				&times;
			</button>
		</div>

		<!-- Body Content Section -->
		<div class="max-w-full overflow-x-auto p-4 text-sm leading-relaxed text-gray-600">
			{#if children}
				{@render children()}
			{:else}
				<p>Default dialog content.</p>
			{/if}
		</div>
		
		<!-- Footer Action Section -->
		<div class="flex justify-end border-t border-gray-100 px-4 py-3">
			<button 
				onclick={onclose} 
				class="rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
			>
				Dismiss
			</button>
		</div>
	</div>
{/if}
