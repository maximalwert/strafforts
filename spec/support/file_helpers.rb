require 'json'

module FileHelpers
  def self.write_expected_file(file_path, content)
    # Usage: FileHelpers.write_expected_file(expected, obj.to_json)
    File.open(file_path, 'w+') do |file|
      file.write(content)
    end
  end
end
