import bleach
from bleach.css_sanitizer import CSSSanitizer

ALLOWED_TAGS = [
    'a', 'abbr', 'acronym', 'b', 'blockquote', 'code',
    'em', 'i', 'li', 'ol', 'strong', 'ul', 'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'span', 'div', 'img', 'figure', 'figcaption', 'table', 'tbody', 'thead', 'tr', 'th', 'td', 'pre', 's', 'u'
]

ALLOWED_ATTRIBUTES = {
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    '*': ['class', 'id', 'style']
}

ALLOWED_STYLES = [
    'color', 'background-color', 'text-align'
]

css_sanitizer = CSSSanitizer(allowed_css_properties=ALLOWED_STYLES)

def sanitize_html(content: str) -> str:
    """Sanitize HTML content using bleach with an allowlist."""
    if not content:
        return content
    return bleach.clean(
        content,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        css_sanitizer=css_sanitizer,
        strip=True
    )
