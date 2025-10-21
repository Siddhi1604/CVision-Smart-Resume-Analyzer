const fs = require('fs');
const path = require('path');
const { supabase } = require('./supabase');

// Migration script to move data from analyses.json to Supabase
const migrateDataToSupabase = async () => {
  try {
    console.log('🚀 Starting migration to Supabase...');
    
    // Check if analyses.json exists
    const analysesPath = path.join(__dirname, 'storage', 'analyses.json');
    if (!fs.existsSync(analysesPath)) {
      console.log('📄 No analyses.json file found, nothing to migrate');
      return;
    }
    
    // Read existing data
    const analysesData = JSON.parse(fs.readFileSync(analysesPath, 'utf8'));
    console.log(`📊 Found ${analysesData.length} analyses to migrate`);
    
    if (analysesData.length === 0) {
      console.log('📄 No analyses to migrate');
      return;
    }
    
    // Migrate data in batches
    const batchSize = 10;
    let migratedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < analysesData.length; i += batchSize) {
      const batch = analysesData.slice(i, i + batchSize);
      
      try {
        const { data, error } = await supabase
          .from('resume_analyses')
          .insert(batch)
          .select();
        
        if (error) {
          console.error(`❌ Error migrating batch ${Math.floor(i / batchSize) + 1}:`, error);
          errorCount += batch.length;
        } else {
          migratedCount += data.length;
          console.log(`✅ Migrated batch ${Math.floor(i / batchSize) + 1}: ${data.length} analyses`);
        }
      } catch (batchError) {
        console.error(`❌ Batch migration error:`, batchError);
        errorCount += batch.length;
      }
    }
    
    console.log(`🎉 Migration completed!`);
    console.log(`✅ Successfully migrated: ${migratedCount} analyses`);
    console.log(`❌ Failed to migrate: ${errorCount} analyses`);
    
    // Create backup of original file
    const backupPath = path.join(__dirname, 'storage', 'analyses_backup.json');
    fs.copyFileSync(analysesPath, backupPath);
    console.log(`💾 Created backup at: ${backupPath}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

// Run migration if this script is executed directly
if (require.main === module) {
  migrateDataToSupabase()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateDataToSupabase };
