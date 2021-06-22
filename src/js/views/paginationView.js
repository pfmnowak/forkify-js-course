import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View {
	_parentElement = document.querySelector('.pagination');

	addHandlerClick(handler) {
		this._parentElement.addEventListener('click', function (e) {
			const btn = e.target.closest('.btn--inline');
			if (!btn) return;
			const goToPage = +btn.dataset.goto;
			handler(goToPage);
		});
	}

	_generateMarkup() {
		const currentPage = this._data.page;
		const numPages = Math.ceil(
			this._data.results.length / this._data.resultPerPage
		);

		// Page 1, and there are other pages
		if (currentPage === 1 && numPages > 1) {
			return this._generateMarkupButton(true, currentPage);
		}

		// Last page
		if (currentPage === numPages && numPages > 1) {
			return this._generateMarkupButton(false, currentPage);
		}

		// Other page
		if (currentPage < numPages) {
			return this._generateMarkupButton(false, currentPage).concat(
				this._generateMarkupButton(true, currentPage)
			);
		}

		// Page 1, and there are NO other pages
		return '';
	}

	_generateMarkupButton = (next, currentPage) => {
		const goToPage = next ? currentPage + 1 : currentPage - 1;
		return `
            <button data-goto="${goToPage}" class="btn--inline pagination__btn--${
			next ? 'next' : 'prev'
		}">
                <span>Page ${goToPage}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-${
			next ? 'right' : 'left'
		}"></use>
                </svg>
            </button>
        `;
	};
}

export default new PaginationView();
