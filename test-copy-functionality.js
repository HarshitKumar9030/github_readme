// Test script to verify copy functionality
// This can be run in browser console to test the copyGitHubMarkdown function

const testContent = `# Test README

This is a test README with various elements:

## Features
- ✅ Feature 1
- ✅ Feature 2
- ✅ Feature 3

## Code Example
\`\`\`javascript
console.log("Hello, World!");
\`\`\`

## Table
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |

## Links
[GitHub](https://github.com)

## Images
![Test Image](https://via.placeholder.com/300x200)

---

**Made with ❤️**
`;

// Function to test copy functionality
async function testCopyFunctionality() {
  try {
    console.log('Testing copy functionality...');
    console.log('Original content length:', testContent.length);
    
    // Test the copy function (assuming it's available globally or can be imported)
    if (typeof copyGitHubMarkdown !== 'undefined') {
      await copyGitHubMarkdown(testContent);
      console.log('✅ Copy function executed successfully');
    } else {
      console.log('❌ copyGitHubMarkdown function not available');
    }
    
    // Test clipboard reading (if available)
    if (navigator.clipboard && navigator.clipboard.readText) {
      const clipboardContent = await navigator.clipboard.readText();
      console.log('Clipboard content length:', clipboardContent.length);
      console.log('✅ Copy verification completed');
    } else {
      console.log('⚠️ Cannot read clipboard content (security restrictions)');
    }
    
  } catch (error) {
    console.error('❌ Copy test failed:', error);
  }
}

console.log('Copy functionality test script loaded');
console.log('Run testCopyFunctionality() to test the copy feature');
